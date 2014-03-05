# Appmaker Vagrant Setup Guide

## Specifications
* This is running ubuntu 12.04 precise 64bit, so you will need a 64bit computer to use this image.
* This is using 10gen-mongo
* App files are stored in /home/vagrant/appmaker

* NOTE: This is in alpha, please be patient and submit bugs in bugzilla to webmaker :: devops or by email to jp@mozillafoundation.org

## Preflight

Make sure you have the following prerequisites installed:

* vagrant (http://www.vagrantup.com/downloads.html)

## Steps after preflight

**Step 1**: Place the Vagrantfile in this directory where you want to run your appmaker dev server from. (for example, /Users/myusername/vagrant/appmaker on MacOSX)

**Step 2**: In your terminal.app or cmd.exe window, cd to the directory you placed the Vagrantfile in (/Users/myusername/vagrant/appmaker on MacOSX in the example above) and run the command vagrant up  (Note: this may download a file, so this may take some time.)

**Step 3**: After the vagrant instance has completed importing and starting, issue the command vagrant ssh into your terminal.app or cmd.exe window

**Step 4**: Issue the command ./start-appmaker from within the running vagrant instance you have ssh'd into
This will start all relevant processes.  You will be able to access them via the following urls on your workstation:
  * http://localhost:5000

