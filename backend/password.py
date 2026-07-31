import bcrypt


def hash_password(pwd):
    byte=pwd.encode('utf-8')
    salt=bcrypt.gensalt()
    hash_pass=bcrypt.hashpw(byte,salt)

    return hash_pass.decode('utf-8'),salt.decode('utf-8')





def verify_password(pwd,hashed_pwd):
    byte_pwd=pwd.encode('utf-8')
    byte_hashedpwd=hashed_pwd.encode('utf-8')
    

    return bcrypt.checkpw(byte_pwd,byte_hashedpwd)


