import serial

conn = serial.Serial(port='/dev/ttyS0', baudrate=9600)
while True:

  data = ''
  while True:
    ch = conn.read().decode()
    if ch == '#' or ch == '\r' or ch == '\n':
      continue
    if ch == '!':
      break
    data += ch
  conn.write(f"#{data} from RASP!".encode('utf-8'))
