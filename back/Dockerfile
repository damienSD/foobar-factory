FROM python:3.10-buster

ENV LANG C.UTF-8
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONPATH "${PYTONPATH}:/app"

RUN set -xe \
    && packages=' \
    ' \
    && buildPackages=' \
    ' \
    && apt-get -qq -y update \
    && apt-get install -y $packages \
    && apt-get install -y $buildPackages --no-install-recommends \
    && apt-get -qq -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# HEAVY INSTALLS
RUN set -xe \
    && packages=' \
    black==21.12b0 \
    docker==5.0.3 \
    redis==4.0.2 \
    ' \
    && pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --no-cache-dir --upgrade pip \
    && pip --no-cache-dir install --trusted-host pypi.org --trusted-host files.pythonhosted.org $packages

WORKDIR /app
COPY ./ ./
CMD ["python", "factory.py"]
