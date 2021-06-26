export const environment = {
 production: false,
 baseUrl: "http://localhost:3000/api",
 gojsUrl: "http://localhost:3000/gojs",
 configBaseUrl: "http://localhost:3002",
 webApiBaseUrl: "http://localhost:8081",
 apiEndPoint: {
  getAllDevice: "/getDevices",
  GetPorts: "/GetPorts",
  GetCard: "/GetCard",
  GetShelf: "/GetShelf",
  GetLink: "/GetLink",
  GetSlot: "/GetSlot",
  getMenu: "/getPageGroupPages",
  createPage: "/getTabsAndElements",
  getDeviceDtl: "/getDeviceDtl",
  getShelfDtl: "/getShelfDtl",
  getPortDtl: "/getPortDtl",
  getCardDtl: "/getCardDtl",
  getLinkDtl: "/getLinkDtl",
  getDeviceData: "/getDeviceData",
  removeNE: "/removeNE",
  GetShelfData: "/getShelfData",
  GetPortsData: "/getPortData",
  GetCardData: "/getCardData",
  GetLinkData: "/getLinkData",
  GetDevAdminData: "/getDevAdminData",
  removeShelf: "/removeShelf",
  removeCard: "/removeCard",
  removePort: "/removePort",
  removeLink: "/removeLink",
  getConfigMenu: "/getConfigPages",
 },
 configApiEndPoint: {
  getDevice: "/getAllDevice",
  dashboardDeviceCounts: "/dashboardDeviceCounts",
  getAllDeviceGroup: "/getAllDeviceGroup",
  getAllDeviceCommand: "/getAllDeviceCommand",
  getAllDeviceFrequency: "/getAllDeviceFrequency",
  getUsers: "/getUsers",
  getCompareFilesInfo: "/getCompareFilesInfo",
  getDeviceByGroup: "/getDeviceByGroup",
  updateDeviceAdmin: "/Updatedevice",
  getUserByGroup: "/getUserByGroup",

  DeleteGroup: "/DeleteDeviceGroup",
  DeleteDevice: "/DeleteDevice",
  DeleteUsers: "/DeleteUsers",
  EnableGroup: "/EnableGroup",
  DisableGroup: "/DisableGroup",
  createGroup: "/deviceGroup",
  updateGroup: "/UpdatedeviceGroup",
 },
 uid: "7",
 orderid: "1",
 apikey: "http://192.168.0.106:3000/api",
};
