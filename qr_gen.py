import qrcode
code = "ch10"   # ← 원하는 코드로 변경
qr = qrcode.QRCode(box_size=12, border=3)
qr.add_data(code); qr.make(fit=True)
qr.make_image(fill_color="#0b1f3a", back_color="white").save(f"qr/qr-{code}.png")
print("생성:", f"qr/qr-{code}.png")