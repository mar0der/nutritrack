#!/bin/bash
# Script to apply DNS fix for p2pweb container on Ubuntu 14.04
# Run after reboot to restore DNS connectivity

# Wait 30 seconds to ensure system services are loaded
sleep 10

# 1. Stop bastille-firewall to set ACCEPT policies
echo "    1.Stopping bastille-firewall"
if [ -f /etc/init.d/bastille-firewall ]; then
    /etc/init.d/bastille-firewall stop
else
    echo "bastille-firewall not found, skipping stop."
fi

# 2. Configure sysctl settings
echo "    2. Configure sysctl settings"
sysctl -w net.bridge.bridge-nf-call-iptables=1
sysctl -w net.ipv4.ip_forward=1
sysctl -w net.netfilter.nf_conntrack_max=131072

# 3. Apply minimal iptables rules
echo "    3.Appling minimal ip tables rules"
iptables -F FORWARD
iptables -F DOCKER-ISOLATION-STAGE-2 2>/dev/null || true
iptables -F DOCKER-ISOLATION-STAGE-1 2>/dev/null || true
iptables -F DOCKER-USER
iptables -t nat -F POSTROUTING

echo "    4. Allow DNS traffic"
# Allow DNS traffic (both UDP and TCP for redundancy)
iptables -I FORWARD 1 -p udp --dport 53 -j ACCEPT
iptables -I FORWARD 2 -p udp --sport 53 -j ACCEPT
iptables -I FORWARD 3 -p tcp --dport 53 -j ACCEPT
iptables -I FORWARD 4 -p tcp --sport 53 -j ACCEPT
iptables -I DOCKER-USER 1 -p udp --dport 53 -j ACCEPT
iptables -I DOCKER-USER 2 -p udp --sport 53 -j ACCEPT
iptables -I DOCKER-USER 3 -p tcp --dport 53 -j ACCEPT
iptables -I DOCKER-USER 4 -p tcp --sport 53 -j ACCEPT

# Allow SSH (port 23 on host, maps to 22 in container)
echo "    5.Allow port 23 for access to the container"
iptables -A INPUT -p tcp --dport 23 -j ACCEPT

# Masquerade for the correct subnet (update based on your network)
iptables -t nat -I POSTROUTING 1 -s 172.18.0.0/16 ! -o br-p2p-network -j MASQUERADE

exit 0
