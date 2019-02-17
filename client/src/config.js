const { protocol, hostname } = window.location

module.exports = {
  API_HOSTNAME: `${protocol}//${hostname}:14938`,
  SOCKET_HOSTNAME: `${protocol}//${hostname}:14937`
}
