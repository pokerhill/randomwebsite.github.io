# Orbital Robotics Landing Page

## Project Overview
Orbital Robotics is a modern React-based landing page for a robotics startup, featuring a responsive design and interactive components.

## Technologies
- React
- React Router
- Tailwind CSS
- Docker
- Nginx

## Prerequisites
- Docker
- Docker Compose

## Development Setup

### Start Development Server
```bash
docker-compose up web-dev
```
- Accessible at `http://localhost:3000`
- Supports hot-reloading

### Production Build
```bash
docker-compose up web-prod
```
- Accessible at `http://localhost:80`
- Nginx-served production build

## Project Structure
- `src/`: React source code
- `public/`: Static assets
- `Dockerfile`: Production build configuration
- `Dockerfile.dev`: Development server configuration
- `docker-compose.yml`: Service definitions

## Customization
- Modify `src/` to update page content
- Adjust Tailwind config for styling
- Update Docker configurations as needed


## Local Development (without Docker)

Follow steps in [here](#install-node-18-whichever-the-dockerfiledev-points-to) to get nodejs installed to your system natively.

```bash
npm install
npm start
```

## Build for Production
```bash
npm run build
```

## WSL configuration

### Network

#### Windows Machine (Docker running from WSL-Ubuntu instance)

1) Forward wsl port(s) to your host windows machine:

`netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=172.XX.XXX.XX`

2) Use `Windows Defender Firewall with Advanced Security` and create an Inbound Rule to permit the ports clients can connect to.

3) Go to your routers gateway IP and forward the dev or prod port(s) to make it accessible to the outside world.

### Install Node-18 (whichever the Dockerfile.dev points to)

Use `nvm` to manage nodejs and npm package version. The default nodejs version installed on Ubuntu is not version 18.

1) Install `nvm`:

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash`

`sudo apt-get update`

`2082  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash`

2) List the available node versions via `nvm`:

`nvm ls`

2) Install the specific `nodejs` version:
  
`nvm install lts/hydrogen`

3) Verify `nodejs` and `npm` versions:

`node --version`

`npm --version`

## Deploy to Github pages

Follow steps in [here](#install-node-18-whichever-the-dockerfiledev-points-to) to get nodejs installed to your system.

Run `npm run deploy`

    This will create a branch in the repo called `gh-pages`. Go to the Github Pages settings and be sure to point to this branch.

