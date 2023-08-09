import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function logout(req: NextApiRequest, res: NextApiResponse) {
try{
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('protected-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    })
  );
  res.status(200).send({ message: 'Logout successful' });
} catch (error) {
    res.status(500).send({message: 'Internal server error'});
}
}
