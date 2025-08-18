import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import i18n from "@/i18n/config";

// set global i18n error map
z.setErrorMap(zodI18nMap);

// reusable custom validators
export const cz = {
  z, // original zod

  // example: preconfigured password schema
  password: () =>
    z
      .string()
      .nonempty(i18n.t("zod.errors.password.required"))
      .min(8, i18n.t("zod.errors.password.min", { limit: 8 }))
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).*$/,
        i18n.t('zod.errors.password.regex')
      ),

  email: () =>
    z.string().email(i18n.t("zod.errors.email.email")),
};
