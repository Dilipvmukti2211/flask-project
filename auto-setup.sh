#!/bin/bash

APP_DIR="/opt/flask-project"
APP_NAME="flaskapp"

echo "Updating system..."
sudo apt update -y

echo "Installing required packages..."
sudo apt install -y python3 python3-venv python3-pip nodejs npm git

echo "Copying project..."
sudo rm -rf $APP_DIR
sudo mkdir -p $APP_DIR
sudo cp -r . $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

cd $APP_DIR

echo "Setting up Python environment..."
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "Installing Node dependencies..."
npm install

echo "Creating systemd service..."

sudo tee /etc/systemd/system/$APP_NAME.service > /dev/null <<EOF
[Unit]
Description=Flask Application
After=network.target

[Service]
User=$USER
WorkingDirectory=$APP_DIR
ExecStart=$APP_DIR/venv/bin/python $APP_DIR/app.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable $APP_NAME
sudo systemctl restart $APP_NAME

echo "--------------------------------"
echo "✅ Setup Completed Successfully"
echo "--------------------------------"
