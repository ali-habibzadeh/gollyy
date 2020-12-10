const brandName = "gollyy";
const domainName = <const>`${brandName}.com`;

export const infrasConfig = <const>{
  brandName,
  domainName,
  authDomainName: `auth.${domainName}`,
};
