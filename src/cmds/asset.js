const path = require('path')
const fs = require('fs')
const { default: fetch } = require('node-fetch')

const mediasUrl = 'https://plugins.livestorm.co/api/v1/medias'
let directory = {}

module.exports = function asset() {
  let givenPath = process.argv[3]
  if (!givenPath) {
    console.log('Please specify the asset to upload')
    console.log('Usage: livestorm asset <file|directory>')
    process.exit(1)
  }
  givenPath = path.join(process.cwd(), givenPath)

  uploadFileOrDirectory(givenPath)
}

async function uploadFileOrDirectory(givenPath) {
  if (fs.lstatSync(givenPath).isDirectory()) {
    if (await getDirectoryToken()) uploadEachFileFrom(givenPath)
  } else {
    uploadFile(givenPath)
  }
}

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
    console.log('Uploading...')
    console.log(`└── ${directory.url}/`)
    return directory.token
  }
}

function uploadEachFileFrom(directory) {
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
  else console.log('Uploading...')


  let res = await fetch(mediasUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'Application/JSON' }
  })

  if (res.status === 201) res = await res.json()
  else throw new Error('Incorrect response, verify integrity and size.')
  
  if (directory.token) console.log(`   ├── ✓ ${data.filename}${data.extension}`)
  else console.log(`Done ! Your file is available at ${rew.url}`)
}

function securityChecksOK(file) {
  if (fs.statSync(file).size / (1024*1024) > 8) {
    console.log(`File ${file} size must be inferior to 8MB.`)
    return false
  }

  const dangerousExtensions = ['.exe', '.msi', '.reg', '.bat', '.action', '.apk', '.app', '.bat', '.bin', '.cmd', 
  '.com', '.command', '.cpl', '.csh', '.exe', '.gadget', '.inf1', '.ins', '.inx', '.ipa', 
  '.isu', '.jar', '.job', '.js','.jse', '.ksh', '.lnk', '.msc', '.msi', '.msp', '.mst', 
  '.osx', '.out', '.paf', '.pif', '.prg', '.ps1', '.reg', '.rgs', '.run', '.scr', '.sct', 
  '.sh', '.shb', '.shs', '.u3p', '.vb', '.vbe', 'vbs' ,'.vbscript', '.workflow', '.ws', '.wsf', '.wsh']

  if (dangerousExtensions.includes(path.extname(file))) return false
  if (path.parse(file).name.startsWith('.')) return false
  return true
}