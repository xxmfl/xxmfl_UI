export default (name) => (resolve) =>
    require ([`@/views/${name}`], resolve)
