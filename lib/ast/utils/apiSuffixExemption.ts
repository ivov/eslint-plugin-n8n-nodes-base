import { CREDS_EXEMPTED_FROM_API_SUFFIX } from "../../constants";

export function isExemptedFromApiSuffix(filename: string) {
	return CREDS_EXEMPTED_FROM_API_SUFFIX.some((cred) => filename.includes(cred));
}
