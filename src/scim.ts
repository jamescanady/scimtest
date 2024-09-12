import { log } from 'console';
import SCIMMY from 'scimmy';

export class Scim {
  static Initialize(logger: Logger, ROUTE_PREFIX: string): SCIMMY {
    SCIMMY.Config.set({
      documentationUri: 'https://example.com/scim/docs',
      patch: {
        supported: false
      },
      bulk: {
        supported: false,
      },
      filter: {
        supported: false
      },
      changePassword: {
        supported: false
      },
      sort: {
        supported: false
      },
      etag: {
        supported: false
      },
      authenticationSchemes: [
        {
          name: 'OAuth Bearer Token',
          description: 'Authentication scheme using the OAuth Bearer Token Standard',
          specUri: 'http://www.rfc-editor.org/info/rfc6750',
          type: 'oauthbearertoken'
        }
      ]
    });

    SCIMMY.Resources.ResourceType.basepath(ROUTE_PREFIX + '/ResourceType');
    SCIMMY.Resources.Schema.basepath(ROUTE_PREFIX + '/Schema');
    SCIMMY.Resources.ServiceProviderConfig.basepath(ROUTE_PREFIX + '/ServiceProviderConfig');
    //  Configure SCIMMY Resources
    SCIMMY.Resources.declare(SCIMMY.Resources.User)
      .extend(SCIMMY.Schemas.EnterpriseUser, true)
      .basepath(ROUTE_PREFIX + '/v2/User')
      .ingress(async (resource, instance) => {
        try {
          //  Nothing to do here yet
          logger.info('Ingressing User Resource');
        } catch (err) {
          logger.error(err);
          switch (err.message) {
            case "Not Found":
              throw new SCIMMY.Types.Error(404, null, `Resource ${resource.id} Not Found`);
            case "Not Unique":
              throw new SCIMMY.Types.Error(409, "uniqueness", "Primary email address is already in use");
            default:
              throw new SCIMMY.Types.Error(500, null, err.message);
          }
        }
      })
      .egress(async (resource) => {
        try {
          //  Nothing to do here yet
          logger.info('Egressing User Resource');
        } catch (err) {
          logger.error(err);
          switch (err.message) {
            case "Not Found":
              throw new SCIMMY.Types.Error(404, null, `Resource ${resource.id} Not Found`);
            default:
              throw new SCIMMY.Types.Error(500, null, err.message);
          }
        }
      })
      .degress(async (resource) => {
        try {
          //  Nothing to do here yet
          logger.info('Degressing User Resource');
        } catch (err) {
          logger.error(err);
          switch (err.message) {
            case "Not Found":
              throw new SCIMMY.Types.Error(404, null, `Resource ${resource.id} Not Found`);
            default:
              throw new SCIMMY.Types.Error(500, null, err.message);
          }
        }
      });
    SCIMMY.Resources.declare(SCIMMY.Resources.Group)
      .basepath(ROUTE_PREFIX + '/v2/Group')
      .ingress(async (resource, instance) => {
        try {
          //  Nothing to do here yet
          logger.info('Ingressing Group Resource');
        } catch (err) {
          logger.error(err);
          switch (err.message) {
            case "Not Found":
              throw new SCIMMY.Types.Error(404, null, `Resource ${resource.id} Not Found`);
            case "Not Unique":
              throw new SCIMMY.Types.Error(409, "uniqueness", "Group Name is already in use");
            default:
              throw new SCIMMY.Types.Error(500, null, err.message);
          }
        }
      })
      .egress(async (resource) => {
        try {
          //  Nothing to do here yet
          logger.info('Egressing Group Resource');
        } catch (err) {
          logger.error(err);
          switch (err.message) {
            case "Not Found":
              throw new SCIMMY.Types.Error(404, null, `Resource ${resource.id} Not Found`);
            default:
              throw new SCIMMY.Types.Error(500, null, err.message);
          }
        }
      })
      .degress(async (resource) => {
        try {
          //  Nothing to do here yet
          logger.info('Degressing Group Resource');
        } catch (err) {
          logger.error(err);
          switch (err.message) {
            case "Not Found":
              throw new SCIMMY.Types.Error(404, null, `Resource ${resource.id} Not Found`);
            default:
              throw new SCIMMY.Types.Error(500, null, err.message);
          }
        }
      });

    return SCIMMY;
  }
}
