#-------------------------------------------------------------------------------
# Copyright (C) 2017 Create-Net / FBK.
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License 2.0
# which accompanies this distribution, and is available at
# https://www.eclipse.org/legal/epl-2.0/
# 
# SPDX-License-Identifier: EPL-2.0
# 
# Contributors:
#     Bioassist / Create-Net - initial API and implementation
#-------------------------------------------------------------------------------

ARG BASEIMAGE_BUILD=agileiot/raspberry-pi3-zulujdk:8-jdk-maven
ARG BASEIMAGE_DEPLOY=agileiot/raspberry-pi3-zulujdk:8-jre

FROM $BASEIMAGE_BUILD

# Add packages
RUN apt-get update && apt-get install --no-install-recommends -y \
    build-essential \
    git\
    ca-certificates \
    apt \
    software-properties-common \
    unzip \
    cpp \
    binutils \
    maven \
    gettext \
    libc6-dev \
    make \
    cmake \
    cmake-data \
    pkg-config \
    clang \
    gcc-4.9 \
    g++-4.9 \
    qdbus \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# resin-sync will always sync to /usr/src/app, so code needs to be here.
WORKDIR /usr/src/app
ENV APATH /usr/src/app

RUN apt-get update && apt-get install --no-install-recommends -y \
    libbluetooth-dev \
    libudev-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install --no-install-recommends -y \
    libglib2.0-0=2.42.1-1+b1 \
    libglib2.0-dev=2.42.1-1+b1 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# we need dbus-launch
RUN apt-get update && apt-get install --no-install-recommends -y \
    dbus-x11 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


RUN apt-get update && apt-get remove binutils --no-install-recommends -y \
&& apt-get clean && rm -rf /var/lib/apt/lists/*

# isntall bluez
RUN echo "deb http://deb.debian.org/debian unstable main" >>/etc/apt/sources.list \
    && apt-get update && apt-get install --no-install-recommends -y \
    bluez/unstable \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production


# workaround for external startup command. To be removed.
RUN mkdir -p /usr/local/libexec/bluetooth/ && ln -s /usr/sbin/bluetoothd /usr/local/libexec/bluetooth/bluetoothd

CMD [ "bash", "node js/bleProtocol.js" ]
