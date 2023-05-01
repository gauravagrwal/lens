/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

 declare module "selfsigned" {
   export interface SelfSignedCert {
     private: string;
     public: string;
     cert: string;
   }

   type GenerateAttributes = unknown[];

   interface GenerateOptions {
     keySize?: number;
     days?: number;
     algorithm?: "sha1" | "sha256";
     extensions?: unknown;
     pkcs7?: boolean;
     clientCertificate?: boolean;
     clientCertificateCN?: string;
   }

   export function generate(GenerateAttributes, GenerateOptions): SelfSignedCert;
 }
