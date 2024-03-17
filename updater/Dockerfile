FROM python:3.12-slim-bookworm

# Install/configure git
RUN apt-get update \
  && apt-get install -y --no-install-recommends git \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
RUN <<EOF
  git config --global user.name 'Racelog Bot'
  git config --global user.email 'noreply@rsfost.github.io'
  git config --global credential.helper \
    '!f(){ echo "username=$GIT_USER"; echo "password=$GIT_PASSWORD"; };f'
EOF

# Install python deps
COPY requirements.txt .
RUN pip install -r requirements.txt && rm -f requirements.txt

ENV REPO=https://github.com/rsfost/cba-racelog.git
ENTRYPOINT git clone "$REPO" cba-racelog/ && \
  cd cba-racelog/ && git checkout gh-pages && \
  ./updater/update-gh-pages-racelog.sh

