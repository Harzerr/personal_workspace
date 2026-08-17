FROM eclipse-temurin:17-jre-jammy

LABEL org.opencontainers.image.title="personal_workspace"

ENV PARAMS=""
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        ca-certificates \
        gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    npm install -g npm@latest && \
    apt-get purge -y --auto-remove curl gnupg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN node -v && npm -v

COPY target/ai-agent-station-study-app.jar /ai-agent-station-study-app.jar

ENTRYPOINT ["sh","-c","java -jar $JAVA_OPTS /ai-agent-station-study-app.jar $PARAMS"]
