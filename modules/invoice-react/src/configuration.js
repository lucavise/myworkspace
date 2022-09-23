const LIFERAY_PARAMS =
  typeof _LIFERAY_PARAMS_ !== "undefined" ? _LIFERAY_PARAMS_ : {};

const INTRANET_BASEURL_SVIL = "http://intranetsv.intra.infocamere.it";
const INTRANET_BASEURL_TEST = "http://intranetts.intra.infocamere.it";
const INTRANET_BASEURL_PROD = "https://intranet.infocamere.it";

const PORTLET_INSTANCE_CONFIGURATION_SVIL = {
  baseUrl: process.env.REACT_APP_CONFIGURATION_baseUrlSvil
};

const PORTLET_INSTANCE_CONFIGURATION_TEST = {
  baseUrl: process.env.REACT_APP_CONFIGURATION_baseUrlTest
};

const PORTLET_INSTANCE_CONFIGURATION_PROD = {
  baseUrl: process.env.REACT_APP_CONFIGURATION_baseUrlProd
};

export default function getConfiguration() {
  return Object.assign(
    LIFERAY_PARAMS?.configuration?.portletInstance ?? {},
  );
}
