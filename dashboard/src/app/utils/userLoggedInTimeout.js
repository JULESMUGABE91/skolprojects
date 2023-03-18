export default (user) => {
  const EXP_TIME = 14400; //4 hours ---- can be extended according to the token expiration time

  const now = new Date().getTime() / 1000;
  const session_expired = user.session_expired;

  const diff = parseInt(now) - parseInt(session_expired);

  if (user && user.token && diff > EXP_TIME) {
    user.token = undefined;
    user.accountVerified = false;

    return true;
  }

  return false;
};
