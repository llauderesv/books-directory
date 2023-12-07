import { Request, Response } from 'express';
import axios from 'axios';
import loadConfig from 'src/config/config';

// Types for retuning Express Response to API Controllers
type Return = Promise<Response<any, Record<string, any>>>;

const config = loadConfig();

async function getAccessToken(req: Request, res: Response): Return {
  const postData = {
    client_id: config.AUTH0_CLIENT_ID,
    client_secret: config.AUTH0_CLIENT_SECRET,
    grant_type: 'client_credentials',
    audience: `http://localhost:8080/`,
  };

  const request = await axios.post(`https://${config.AUTH0_DOMAIN}/oauth/token`, postData, {
    headers: { 'content-type': 'application/json' },
  });

  if (request.status !== 200) {
    return res.status(request.status).json({ message: 'Error acquiring access token' });
  }

  return res.json({ ...request.data });
}

export default { getAccessToken };
