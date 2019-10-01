#!/bin/zsh
cf delete -f mminella-grafana
cf delete -f mminella-prometheus-proxy
cf delete -f mminella-prometheus
cf delete -f mminella-data-flow-server
cf delete -f mminella-skipper-server

cd /Users/mminella/Documents/IntelliJWorkspace/Batch-In-2019/bin/
cf push -f server.yml

./addAppPort.sh mminella-prometheus-proxy 10011 playground tcp.apps.pcfone.io
