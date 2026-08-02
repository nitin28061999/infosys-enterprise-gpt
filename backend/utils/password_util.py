from pwdlib import PasswordHash

pass_hash = PasswordHash.recommended()

def hashPassword(password: str) -> str :
    return pass_hash.hash(password)

def verifyPassword(password: str, hash: str) -> bool :
    return pass_hash.verify(password, hash)