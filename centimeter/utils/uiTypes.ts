import type { Component } from 'vue'

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastPayload {
  title: string;
  message?: string;
  duration?: number;
}

export interface Option {
  icon: Component;
  label: string;
  color: string;
}

export interface NavButtons {
  name: string;
  path: string;
  dropdown?: { name: string; path: string }[];
}

export interface ShowButtons {
  name: string;
  path: string;
  dropdown?: { name: string; }[];
}
