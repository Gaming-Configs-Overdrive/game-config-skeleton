export function applyVideoResolution(
  config,
  { widthConfigName, width, heightConfigName, height }
) {
  let modified = config
  modified = modified.replace(
    new RegExp(`("${widthConfigName}"\\s+")(\\d+)(")`),
    `$1${width}$3`
  )
  modified = modified.replace(
    new RegExp(`("${heightConfigName}"\\s+")(\\d+)(")`),
    `$1${height}$3`
  )

  return modified
}
