
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import compression from 'compression';

import { Logger } from './logging';
import { Scim } from './scim';

const {
  APP_VERSION,
  APPLICATION_NAME,
  ENVIRONMENT,
  ROUTE_PREFIX
} = process.env;

const app = express();
const logger = new Logger();
const SCIMMY =  Scim.Initialize(logger, ROUTE_PREFIX);

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  error logger
//  eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(async (err, req: Request, res: Response, next: NextFunction) => {
  logger.error('Request Error:', err);
  if(req.xhr) {
    res?.status(500).send('Something failed!');
  } else {
    res?.status(500).json({ error: err });
  }
});

//  Request Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const { httpVersion, method, socket, url, path } = req;
  const { remoteAddress, remoteFamily } = socket;
  //  skip logging health and version routes
  const skipRoutes = [`${ROUTE_PREFIX}/health`, `${ROUTE_PREFIX}/version`];
  if (skipRoutes.includes(path) === false) {
    logger.info({
      httpVersion,
      method,
      path,
      remoteAddress,
      remoteFamily
    }, url);
  }
  next();
});

//  health check
app.get(`${ROUTE_PREFIX}/health`, (req: Request, res: Response) => {
  res.send('ok');
});
//  version
app.get(`${ROUTE_PREFIX}/version`, (req: Request, res: Response) => {
  res.json({
    name: APPLICATION_NAME,
    environment: ENVIRONMENT,
    portfolio: 'ce',
    source: 'platform',
    version: APP_VERSION
  });
});

// hello route
app.get(`${ROUTE_PREFIX}/hello`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).send('world');
  } catch (err) {
    next(err);
  }
});

//  Discovery
app.get(`${ROUTE_PREFIX}/Schemas`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schemas = await SCIMMY.Resources.Schema.read();
    res.json(schemas);
  } catch (err) {
    next(err);
  }
});
app.get(`${ROUTE_PREFIX}/ResourceTypes`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await SCIMMY.Resources.ResourceType.read();
    res.json(resources);
  } catch (err) {
    next(err);
  }
});
app.get(`${ROUTE_PREFIX}/ServiceProviderConfig`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await SCIMMY.Resources.ServiceProviderConfig.read();
    res.json(config);
  } catch (err) {
    next(err);
  }
});

app.get(`${ROUTE_PREFIX}/test/Schemas`, (req: Request, res: Response, next: NextFunction) => {
  try {
    const schemas = SCIMMY.Schemas.declared();
    res.json(schemas);
  } catch (err) {
    next(err);
  }
});
app.get(`${ROUTE_PREFIX}/test/ResourceTypes`, (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = SCIMMY.Resources.declared();
    res.json(resources);
  } catch (err) {
    next(err);
  }
});
app.get(`${ROUTE_PREFIX}/test/ServiceProviderConfig`, (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = SCIMMY.Config.get();
    res.json(config);
  } catch (err) {
    next(err);
  }
});


const httpsServer = http.createServer(app);

const PORT = process.env.PORT || 80;

httpsServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
