/* eslint-disable react-refresh/only-export-components */
import React, { createContext } from "react";

export const MovieDataContext = createContext(null);
export const MovieFilterContext = createContext(null);
export const MovieNotificationContext = createContext(null);

export const MovieContext = MovieDataContext;
