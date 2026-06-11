function notFoundHandler(req, res) {
  res.status(404).json({ error: '接口不存在' });
}

function errorHandler(err, req, res, next) {
  console.error('[Server Error]', err);
  res.status(500).json({ error: '服务器内部错误' });
}

module.exports = { notFoundHandler, errorHandler };
