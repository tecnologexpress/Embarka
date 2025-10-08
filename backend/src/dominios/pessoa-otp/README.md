Atualmente a lógica para envio de código verificador (2FA) acontece na entidade otp-service no banco de dados.
Futuramente, pensar em uma opção alternativa como redis, ou algo temporário, para não sobrecarregar o banco com
dados desnecessários.