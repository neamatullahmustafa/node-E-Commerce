export class ApiFeatures {
  constructor(queryObj, queryStr) {
    this.queryObj = queryObj;
    this.queryStr = queryStr;
  }
  pagination() {
    let pageNumber = this.queryStr.page * 1 || 1;
    if (pageNumber < 0) pageNumber = 1;
    const limit = this.queryStr.limit || 10;
    const skip = (parseInt(pageNumber) - 1) * limit;
    this.pageNumber = pageNumber;
    this.queryObj.skip(skip).limit(limit);
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.queryObj.sort(sortBy);
    } else {
      this.queryObj.sort("-createdAt");
    }
    return this;
  }
  search() {
    if (this.queryStr.search) {
      const regex = new RegExp(this.queryStr.search, "i");
      this.queryObj.find({
        $or: [{ name: regex }, { description: regex }],
      });
    }

    return this;
  }
  filter() {
    let filterObj = structuredClone(this.queryStr);
    filterObj = json.stringify(filterObj);
    filterObj = filterObj.replace(
      /(gt|gte|lt|lte|ne|in|nin|or|and|not|exists|type|mod|regex|options|select|populate|skip|limit|)/g,
      (val) => "$" + val
    );
    filterObj = JSON.parse(filterObj);
    let excludedFields = ["page", "search", "limit", "fields", "sort"];
    excludedFields.forEach((val) => {
      delete filterObj[val];
    });
    this.queryObj.find(filterObj);
    return this;
  }
  select() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.queryObj.select(fields);
    }
    return this;
  }
}
