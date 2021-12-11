import React, { useRef } from "react";
import Recaptcha from "react-native-recaptcha-that-works";
import { flashAlert } from "../../utils/flash_message";

const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;
const RECAPTCHA_BASE_URL = process.env.RECAPTCHA_BASE_URL;

const RecaptchaComponent = ({ recaptchaRef, onVerify, onExpire }) => (
  <Recaptcha
    ref={recaptchaRef}
    siteKey={RECAPTCHA_SITE_KEY}
    baseUrl={RECAPTCHA_BASE_URL}
    onVerify={onVerify}
    onExpire={onExpire}
    onError={(error) => {
      flashAlert(error);
    }}
    theme="dark"
    size="invisible"
  />
);

export default RecaptchaComponent;
