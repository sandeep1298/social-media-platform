const searchService = require("../services/searchService");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const search = asyncHandler(async (req, res) => {
  const results = await searchService.getSearchResults({
    q: req.query.q || "",
    sort: req.query.sort || "recent"
  });

  sendSuccess(res, { data: results });
});

module.exports = { search };
