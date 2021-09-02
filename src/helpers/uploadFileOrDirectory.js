const path = require('path')
const fs = require('fs')
const { default: fetch } = require('node-fetch')
const livestormDomain = require('./livestormDomain')

const mediasUrl = `${livestormDomain}/api/v1/medias`
let directory = {}
let verbose = true

async function uploadFileOrDirectory(givenPath, isVerbose = true) {
  verbose = isVerbose
  if (fs.lstatSync(givenPath).isDirectory()) {
    if (await getDirectoryToken()) uploadDirectory(givenPath)
  } else {
    return uploadFile(givenPath)
  }
}

module.exports = uploadFileOrDirectory

async function getDirectoryToken() {
  if (directory.token) return directory.token

  const response = await fetch(
    `${mediasUrl}/folder`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'Application/JSON' }
    }
  )
  directory = await response.json()
  if (directory.token) {
    say('Uploading...')
    say(`└── ${directory.url}/`)
    return directory.token
  }
}

function uploadDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    files.forEach(file => {
      uploadFileOrDirectory(path.join(directory, file))
    })
  }) 
}

async function uploadFile(file) {
  if (!securityChecksOK(file)) return

  const data = {
    base64: fs.readFileSync(file, {encoding: 'base64'}),
    extension: path.extname(file),
    filename: path.parse(file).name,
  }
  
  if (directory.token) data.token = directory.token
  else say('Uploading...')


  const res = await fetch(mediasUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'Application/JSON' }
  })

  if (res.status !== 201) throw new Error('Incorrect response, verify integrity and size.')

  if (directory.token) say(`   ├── ✓ ${data.filename}${data.extension}`)
  else {
    const url = (await res.json()).url
    say(`Done ! Your file is available at ${url}`)
    return url
  }
}

function securityChecksOK(file) {
  if (fs.statSync(file).size / (1024*1024) > 8) {
    say(`File ${file} size must be inferior to 8MB.`)
    return false
  }

  const dangerousExtensions = ['.exe', '.msi', '.reg', '.bat', '.action', '.apk', '.app', '.bat', '.bin', '.cmd', 
  '.com', '.command', '.cpl', '.csh', '.exe', '.gadget', '.inf1', '.ins', '.inx', '.ipa', 
  '.isu', '.jar', '.job', '.jse', '.ksh', '.lnk', '.msc', '.msi', '.msp', '.mst', 
  '.osx', '.out', '.paf', '.pif', '.prg', '.ps1', '.reg', '.rgs', '.run', '.scr', '.sct', 
  '.sh', '.shb', '.shs', '.u3p', '.vb', '.vbe', 'vbs' ,'.vbscript', '.workflow', '.ws', '.wsf', '.wsh']

  if (dangerousExtensions.includes(path.extname(file))) return false
  if (path.parse(file).name.startsWith('.')) return false
  return true
}

function say(something) {
  if (verbose) {
    console.log(something)
  }
}