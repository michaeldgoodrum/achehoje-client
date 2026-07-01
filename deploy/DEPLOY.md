# Deploying Ache Hoje to AWS

The cost-efficient design: one small Graviton instance (**t4g.micro**) runs the
whole stack — MongoDB + Express API + nginx frontend + a Caddy reverse proxy —
via Docker Compose, behind a single public URL. **Caddy provides automatic HTTPS**
(Let's Encrypt) when you give it a domain; otherwise it serves plain HTTP on
port 80. Mongo, the API, and nginx stay on the internal Docker network; only
Caddy is exposed (ports 80/443).

**Cost:** free-tier eligible in year 1; ~**$5–6/month** on-demand after
(t4g.micro + 20 GB gp3 + Elastic IP). No managed database, no load balancer.

> Everything below runs **under your AWS account** — you'll need the AWS CLI
> configured (`aws configure`) or Console access. These commands create billable
> resources.

---

## Prerequisites

- An AWS account and the AWS CLI configured locally (`aws configure`).
- This repo pushed somewhere the instance can `git clone` (a public GitHub URL
  is simplest; for a private repo see "Private repo" below).
- (Optional) An EC2 key pair if you want SSH access.

---

## Option A — CloudFormation (one command)

`deploy/cloudformation.yaml` provisions the instance, security group, Elastic
IP, and boots the stack automatically.

```bash
aws cloudformation deploy \
  --template-file deploy/cloudformation.yaml \
  --stack-name achehoje \
  --parameter-overrides \
      RepoUrl=https://github.com/<you>/achehoje-client.git \
      SshCidr=$(curl -s https://checkip.amazonaws.com)/32 \
      KeyName=my-keypair \
      DomainName=app.example.com \
  --capabilities CAPABILITY_IAM
```

- `RepoUrl` — required; the git URL the instance clones on boot.
- `SshCidr` — locks SSH to your current IP (the command above fills it in). Omit
  `KeyName` entirely to skip SSH.
- `DomainName` — optional. With it set, Caddy provisions HTTPS automatically.
  **Point an A record for that domain at the stack's Elastic IP** (see the
  `PublicIp` output); Caddy retries cert issuance until DNS resolves, so it's
  fine to add the DNS record right after the stack finishes. Omit it to serve
  plain HTTP.

Get the URL when it finishes (first boot takes ~2–4 min to build the images):

```bash
aws cloudformation describe-stacks --stack-name achehoje \
  --query 'Stacks[0].Outputs' --output table
```

Open the `Url` output. Tear everything down with:

```bash
aws cloudformation delete-stack --stack-name achehoje
```

---

## Option B — Manual (any Lightsail/EC2 box)

1. Launch an **Amazon Linux 2023**, **arm64**, **t4g.micro** instance
   (Lightsail's $5 plan works too). Open ports **80**, **443**, and **22** in
   its firewall/security group.
2. SSH in and get the code:

   ```bash
   sudo dnf install -y git
   git clone https://github.com/<you>/achehoje-client.git
   cd achehoje-client
   ```
3. **(Optional) Enable HTTPS** — point your domain's A record at the instance's
   public IP, then:

   ```bash
   echo "SITE_ADDRESS=app.example.com" > deploy/.env
   ```
4. Bring the stack up:

   ```bash
   sudo bash deploy/bootstrap.sh
   ```

   `bootstrap.sh` installs Docker + Compose and runs
   `docker compose -f deploy/docker-compose.prod.yml up -d --build`.
5. Open `https://app.example.com` (or `http://<instance-public-ip>` if you
   skipped the domain).

---

## Updating a running deployment

```bash
cd achehoje-client
git pull
sudo docker compose -f deploy/docker-compose.prod.yml up -d --build
```

The read-only catalog is re-seeded on each `up`; there's no user data to lose.

---

## Notes

- **HTTPS** is handled by Caddy automatically when `SITE_ADDRESS` is a domain —
  it obtains and renews a Let's Encrypt certificate and redirects http→https. It
  needs ports 80 and 443 reachable (both are open in the template's security
  group) and the domain's DNS pointing at the instance. Certs persist in the
  `caddy-data` Docker volume across restarts. Without a domain it serves plain
  HTTP on port 80.
- **MongoDB is internal only** and has no auth — it isn't published to the
  internet (no `ports:` in the prod compose). Don't expose it. For anything
  beyond a demo, add credentials or switch to MongoDB Atlas (free M0 tier).
- **x86 instead of Graviton.** The template defaults to arm64 to match t4g. To
  use a `t3.micro`, change `InstanceType` and set `LatestAmiId` to the x86_64
  AL2023 AMI parameter (`/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64`).
- **Private repo.** The instance needs read access — either use a deploy token
  in `RepoUrl`, or `scp` the code to the box instead of `git clone` and then run
  `sudo bash deploy/bootstrap.sh`.
