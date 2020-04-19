const SwaggerParser = require('swagger-parser');
const moment = require('moment');
const db = require('../models/contracts');

// const model = require('../models/contracts');

// Return the list of all articles
exports.findAll = async (request, response) => {
  // const articles = await model.find().sort("_id");
  db.find({}, (err, docs) => {
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
    response.send(docs);
  });
};

exports.findAllNames = async (request, response) => {
  // const articles = await model.find().sort("_id");
  db.find({}, {
    swagger: 1,
  }, (err, docs) => {
    response.send(docs);
  });
};

exports.findById = async (request, response) => {
  db.find({
    _id: request.params.id,
  }, (err, docs) => {
    if (err) {
      response.status(500).send({
        error: err,
      });
    } else if (docs.length >= 1) {
      response.send(docs[0]);
    } else {
      response.status(500).send({
        error: 'Multiple documents found',
      });
    }
  });
};

exports.findSwaggerById = async (request, response) => {
  db.find({
    _id: request.params.id,
  }, (err, docs) => {
    if (err) {
      response.status(500).send({
        error: err,
      });
    } else if (docs.length >= 1) {
      response.send(docs[0].json);
    } else {
      response.status(500).send({
        error: 'Multiple documents found',
      });
    }
  });
};

exports.create = async (request, response) => {
  const swaggerDoc = request.body;

  if (swaggerDoc == null) {
    response.status(500).send({
      error: 'Json Body should not be null',
    });
  }

  try {
    const swaggerJson = await SwaggerParser.validate(swaggerDoc);

    let version = 'NA';
    let client = 'NA';
    let env = 'NA';

    const splittedVersion = swaggerJson.info.version.split('.');
    if (splittedVersion.length >= 2) {
      version = `${splittedVersion[0]}.${splittedVersion[1]}`;
    }

    const splittedHost = swaggerJson.host.split('.');
    if (splittedHost.length > 2) {
      client = splittedHost[0];
      env = splittedHost[1];
    }

    const contract = {
      dtInsert: moment().unix(),
      swagger: {
        title: swaggerJson.info.title,
        version,
        client,
        env,
      },
      json: JSON.stringify(swaggerJson),
    };
    db.insert(contract, (err, newDoc) => {
      // newDoc is the newly inserted document, including its _id
      // newDoc has no key called notToBeSaved since its value was undefined
      if (err) {
        response.status(500).send({
          error: err.toString(),
        });
      } else {
        response.send(newDoc._id);
      }
    });
  } catch (err) {
    response.status(500).send({
      error: err.toString(),
    });
  }
};

exports.update = async (request, response) => {
  response.send([]);
};

exports.delete = async (request, response) => {
  db.remove({ _id: request.params.id }, {}, (err, numRemoved) => {
    if (err) {
      response.status(500).send({
        error: err.toString(),
      });
    } else {
      response.send({
        total: numRemoved,
      });
    }
  });
};

exports.clear = async (request, response) => {
  db.remove({}, {
    multi: true,
  }, (err, numRemoved) => {
    if (err) {
      response.status(500).send({
        error: err.toString(),
      });
    } else {
      response.send({
        total: numRemoved,
      });
    }
  });
};
