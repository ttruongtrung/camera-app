const ACCESS_TOKEN = 'avc';

exports.authenticate = (req, res) => {
    if (req.body.grant_type != "client_credentials") {
      return res.status(500).json({
        ErrorCode: "invalid_grant_type",
        Error: "grant_type is required",
      });
    }
  
    if (req.body.client_id != "admin" || req.body.client_secret != "Admin_12admin") {
      return res
        .status(401)
        .json({ ErrorCode: "invalid_client", Error: "ClientId is Invalid" });
    }
  
    res.status(200).json({
      access_token: ACCESS_TOKEN,
      token_type: "Bearer",
      expires_in: 86400,
    });
  };
  
  exports.authorize = (req, res, next) => {
    if (req.headers?.authorization != `Bearer ${ACCESS_TOKEN}`) {
      return res.status(401).json({
        exception: {
          httpStatusCode: "401",
          code: "401001",
          message: "Unauthorized",
          detail: "Invalid Access Token",
        },
      });
    }
  
    next();
  };