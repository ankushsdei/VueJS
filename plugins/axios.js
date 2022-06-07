import * as axios from "axios";
import config from '../../config/config';
const environment = process.env.NODE_ENV || "development";
const environmentConfig = config[environment];

// Todo: revise as per needed
// Axios configuration
const options = {
  baseURL: [
    environmentConfig.api_url,
    environmentConfig.api_port || null
  ].filter(f=>f).join(':')+'/'
};

export default axios.create(options);
