'use strict';

const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.MESSAGE_TABLE;

/**
 * 取得 item
 *
 * @param id
 * @returns {Promise}
 */
function get(id) {
  let params = {
    TableName: TABLE_NAME,
    Key: {
      messageId: id
    }
  };
  return documentClient.get(params)
    .promise()
    .then(result => {
      return result.Item;
    });
}

/**
 * 新增 item
 *
 * @param item
 * @returns {Promise}
 */
function put(item) {
  let params = {
    TableName: TABLE_NAME,
    Item: item
  };
  return documentClient.put(params)
    .promise()
    .then(() => item);
}

/**
 * 更新 item
 *
 * @param id
 * @param item
 * @returns {Promise}
 */
function update(id,item) {
  let params = {
    TableName: TABLE_NAME,
    Key: {
      messageId: id
    },
    UpdateExpression: 'set #name = :n, #message = :m, #updatedAt = :u',
    ExpressionAttributeNames: {
      '#name' : 'name',
      '#message' : 'message',
      '#updatedAt' : 'updatedAt'
    },
    ExpressionAttributeValues: {
      ':n' : item.name,
      ':m' : item.message,
      ':u' : item.updatedAt,
    }
  };
  return documentClient.update(params)
    .promise()
    .then(() => item);
}

/**
 * 取得所有 items
 *
 * @returns {Promise}
 */
function scan() {
  let params = {
    TableName: TABLE_NAME
  };
  return documentClient.scan(params)
    .promise()
    .then(result => result.Items);
}

/**
 * 刪除 item
 *
 * @param pid
 * @param CS
 * @returns {Promise}
 */
function remove(id) {
  let params = {
    TableName: TABLE_NAME,
    Key: {
      messageId: id
    }
  };
  return documentClient.delete(params)
    .promise()
    .then(result => result);
}

module.exports = {
  get,
  put,
  update,
  scan,
  remove
};
