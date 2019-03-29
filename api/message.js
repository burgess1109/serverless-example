'use strict';

const uuidv4 = require('uuid/v4');

const messageStore = require('./model/messageStore');
const Response = require('./response');
const Validate = require('./validate');

async function list(event, context, callback) {
  let response = {};
  try {
    let items = await messageStore.scan();
    response = Response.success({
      data: items
    });
  } catch(error) {
    console.error(error);
    response = Response.error(error.statusCode, error.message);
  }

  callback(null, response);
}

async function get(event, context, callback) {
  let id = event.pathParameters.id;

  let response = {};
  try {
    let item = await messageStore.get(id);
    response = Response.success({
      data: item
    });
  } catch(error) {
    console.error(error);
    response = Response.error(error.statusCode, error.message);
  }

  callback(null, response);
}

async function create(event, context, callback) {
  let input = JSON.parse(event.body);
  let response = {};

  try {
    const messageValidate = new Validate(input);
    messageValidate.message(input);
    let item = {
      messageId: uuidv4(),
      name: input.name,
      message: input.message,
      updatedAt: new Date().getTime(),
      createdAt: new Date().getTime(),
    };
    let result = await messageStore.put(item);
    console.log(result);
    response = Response.success('SUCCESS');
  } catch(error) {
    console.log(error);
    response = Response.error(error.statusCode, error.message);
  }

  callback(null, response);
}

async function put(event, context, callback) {
  let id = event.pathParameters.id;
  let input = JSON.parse(event.body);
  let response = {};

  try {
    const messageValidate = new Validate(input);
    messageValidate.message(input);
    let item = {
      messageId: id,
      name: input.name,
      message: input.message,
      updatedAt: new Date().getTime(),
    };
    await messageStore.update(id,item);
    response = Response.success('SUCCESS');
  } catch(error) {
    console.log(error);
    response = Response.error(error.statusCode, error.message);
  }

  callback(null, response);
}

async function remove(event, context, callback) {
  let id = event.pathParameters.id;
  let response = {};
  try {
    await messageStore.remove(id);
    response = Response.success('SUCCESS');
  } catch(error) {
    console.error(error);
    response = Response.error(error.statusCode, error.message);
  }

  callback(null, response);
}

module.exports = {
  list,
  get,
  create,
  put,
  remove
};
