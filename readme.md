# Bitcoin bot server

## Run on Raspberry

### Build for Raspberry

docker buildx build --platform linux/arm/v7 -t alpine-arm32 --load . -t krajicj/crypto-bot-server-arm


1) Flash SD card with Raspbian OS 
	- https://www.raspberrypi.com/software/operating-systems/
	- https://downloads.raspberrypi.org/raspios_lite_armhf/images/raspios_lite_armhf-2021-05-28/2021-05-07-raspios-buster-armhf-lite.zip

2) Put SD card into your raspberry and plug in into power. After boot the default login and password is (pi raspberry)

3) Change your raspberry pi account password "sudo raspi-config"

4) Shutdown raspberry "sudo shutdown" remove SD card, plug it into your pc and run command in volume folder on SD card "touch ssh" This enable ssh access
	- https://phoenixnap.com/kb/enable-ssh-raspberry-pi

5) Connect your raspberry to the internet via patch cabel

6) Run commands "sudo apt-get update" and "sudo apt-get upgrade" to update system

7) Set static ip address of your raspberry
	- https://www.ionos.com/digitalguide/server/configuration/provide-raspberry-pi-with-a-static-ip-address/
	- "sudo service dhcpcd start"
	- "sudo systemctl enable dhcpcd"
	- "sudo nano /etc/dhcpcd.conf"

	- uncomment these lines and set ip_address to some free ip address in your network

interface eth0
static ip_address=192.168.0.4/24
static routers=192.168.0.1
static domain_name_servers=192.168.0.1

8) Reboot by "sudo reboot"

9) Now you can access raspberry via ssh
	- "ssh ip_address -l pi"
	- then enter your password for account pi
 

10) install docker
	- https://phoenixnap.com/kb/docker-on-raspberry-pi
	- "curl -fsSL https://get.docker.com -o get-docker.sh"
	- "sudo sh get-docker.sh"
	- "sudo usermod -aG docker pi"

11) Install app using docker

sudo docker pull krajicj/crypto-bot-server-arm

sudo docker pull krajicj/crypto-bot-front-arm

sudo docker create --name crypto-bot-server -i -p 5000:5000 --restart unless-stopped krajicj/crypto-bot-server-arm 

sudo docker start -i crypto-bot-server

Set password of your app and hit ctr + c

sudo docker start crypto-bot-server

sudo docker create --name crypto-bot-front -p 3000:3000 --restart unless-stopped krajicj/crypto-bot-front-arm 

sudo docker start crypto-bot-front

12) If you are on the same network you can put your raspberry_ip_address:3000 to your browser and log in to the system with app password you choose

13) On page keys set your coinbase pro api keys 

14) Create schedulers and DCA...

