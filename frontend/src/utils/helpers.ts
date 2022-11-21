import {
  HapiPractitionerEntryItem,
  HapiPractitionersResponse,
  HapiTelecomItem,
  HapiTelecomType,
  Resource
} from '../types/Hapi.types';

interface getFullNameType { firstName: string, lastName: string }

export const getFullName = (resource: Resource): getFullNameType => {
  let firstName: string = '';
  let lastName: string = '';

  if (resource.name) {
    firstName = resource.name[0]?.given?.join(' ') || '';
    lastName = resource.name[0].family || '';
  }

  return { firstName, lastName };
}

export const getEmail = (resource: Resource): string => {
  let email: string = '';

  if (resource.telecom) {
    email = resource?.telecom?.filter((t: HapiTelecomItem) => t.system === HapiTelecomType.EMAIL)[0]?.value;
  }

  return email;
}

export const getAddress = (resource: Resource): { address: string } => {
  let address: string = '';

  if (resource.address) {
    const addressObj = resource.address

    if (addressObj[0]) {
      let streetAdd: string = '';

      if (addressObj[0]?.line?.length) {
        streetAdd = addressObj[0].line[0];
      }
      address = `${streetAdd} ${addressObj[0].city} ${addressObj[0].country} ${addressObj[0].postalCode}`
    }
  }
  return { address };
}

export const getFormattedPhone = (resource: Resource): string => {
  let phone: string = '';

  if (resource.telecom) {
    resource?.telecom?.filter((t: HapiTelecomItem) => t.system === HapiTelecomType.PHONE)[0]?.value;
  }

  return phone;
}

export const getFax = (resource: Resource): string => {
  let fax: string = '';

  if (resource.telecom) {
    resource?.telecom?.filter((t: HapiTelecomItem) => t.system === HapiTelecomType.PHONE)[0]?.value;
  }

  return fax;
}

interface GetTelecomInfoType { phone: string, fax: string, email: string }

export const getTelecomInfo = (resource: Resource): GetTelecomInfoType => {
  let phone: string = '';
  let fax: string = '';
  let email: string = '';

  if (resource.telecom) {
    phone = getFormattedPhone(resource);
    fax = getFax(resource)
    email = getEmail(resource);
  }

  return { phone, fax, email };
}

export interface NormalizedPractitioner {
  id: string,
  firstName: string,
  lastName: string,
  phone: string,
  fax: string,
  email: string,
  address: string,
}

export const normalizeFetchedPractitioners = (entries: HapiPractitionerEntryItem[]): NormalizedPractitioner[] => {
  return entries.map((en) => {
    return normalizePractitionerResult(en.resource);
  })
}

export const normalizePractitionerResult = (resource: Resource): NormalizedPractitioner => {
  const { firstName, lastName } = getFullName(resource);
  const { phone, email, fax } = getTelecomInfo(resource);
  const { address } = getAddress(resource);

  return {
    id: resource.id,
    firstName,
    lastName,
    phone,
    fax,
    email,
    address,
  }
}

export const getLabelNameFromPractitionerResult = (key: string) => {
  switch (key) {
    case 'id':
      return 'Id';
    case 'firstName':
      return 'First name';
    case 'lastName':
      return 'Last name';
    case 'phone':
      return 'Phone';
    case 'fax':
      return 'Fax';
    case 'email':
      return 'Email';
    case 'address':
      return 'Address';
    case 'lastUpdated':
      return 'Last Updated';
  }
}

interface IGetLinkUrls {
  previousPage: string | null;
  currentPage: string | null;
  nextPage: string | null;
}

export const getLinkUrls = (data: HapiPractitionersResponse): IGetLinkUrls => {
  let previousPage: string | null = null;
  let currentPage: string | null = null;
  let nextPage: string | null = null;

  if (data.link) {
    previousPage = data.link.find((link) => link.relation === 'previous')?.url || null;
    currentPage = data.link.find((link) => link.relation === 'self')?.url || null;
    nextPage = data.link.find((link) => link.relation === 'next')?.url || null;
  }

    return { previousPage, currentPage, nextPage }
}
