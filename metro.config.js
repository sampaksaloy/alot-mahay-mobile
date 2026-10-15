// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');
const path = require('path');

// Fix for Windows OneDrive reparse points being misidentified as symlinks by Node.js Dirent
if (process.platform === 'win32') {
  const origIsSym = fs.Dirent.prototype.isSymbolicLink;
  const origIsFile = fs.Dirent.prototype.isFile;
  const origIsDir = fs.Dirent.prototype.isDirectory;

  fs.Dirent.prototype.isSymbolicLink = function () {
    if (!origIsSym.call(this)) return false;
    try {
      const fullPath = path.join(this.parentPath || this.path || '', this.name);
      return fs.lstatSync(fullPath).isSymbolicLink();
    } catch {
      return false;
    }
  };

  fs.Dirent.prototype.isFile = function () {
    if (origIsFile.call(this)) return true;
    if (origIsSym.call(this)) {
      try {
        const fullPath = path.join(this.parentPath || this.path || '', this.name);
        const stat = fs.lstatSync(fullPath);
        return !stat.isSymbolicLink() && stat.isFile();
      } catch {
        return false;
      }
    }
    return false;
  };

  fs.Dirent.prototype.isDirectory = function () {
    if (origIsDir.call(this)) return true;
    if (origIsSym.call(this)) {
      try {
        const fullPath = path.join(this.parentPath || this.path || '', this.name);
        const stat = fs.lstatSync(fullPath);
        return !stat.isSymbolicLink() && stat.isDirectory();
      } catch {
        return false;
      }
    }
    return false;
  };

  const origReadlink = fs.promises.readlink;
  fs.promises.readlink = async function (p, options) {
    try {
      return await origReadlink.call(this, p, options);
    } catch (err) {
      if (err && err.code === 'EINVAL') {
        return p;
      }
      throw err;
    }
  };

  const origReadlinkSync = fs.readlinkSync;
  fs.readlinkSync = function (p, options) {
    try {
      return origReadlinkSync.call(this, p, options);
    } catch (err) {
      if (err && err.code === 'EINVAL') {
        return p;
      }
      throw err;
    }
  };
}

const config = getDefaultConfig(__dirname);

module.exports = config;
