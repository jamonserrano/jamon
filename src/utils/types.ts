export const isUndefined = (ref: any): ref is undefined => ref === undefined;

export const isString = (ref: any): ref is string => typeof ref === "string";

export const isElement = (ref: any): ref is Element => ref instanceof Element
