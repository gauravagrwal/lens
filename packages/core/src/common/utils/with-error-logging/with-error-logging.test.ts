/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getDiForUnitTesting } from "../../../main/getDiForUnitTesting";
import withErrorLoggingInjectable from "./with-error-logging.injectable";
import { pipeline } from "@ogre-tools/fp";
import type { AsyncFnMock } from "@async-fn/jest";
import asyncFn from "@async-fn/jest";
import { getPromiseStatus } from "@k8slens/test-utils";
import logErrorInjectable from "../../log-error.injectable";
import type { Logger } from "../../logger";

describe("with-error-logging", () => {
  describe("given decorated sync function", () => {
    let toBeDecorated: jest.MockedFunction<(a: string, b: string) => number | undefined>;
    let decorated: (a: string, b: string) => number | undefined;
    let logErrorMock: jest.MockedFunction<Logger["error"]>;

    beforeEach(() => {
      const di = getDiForUnitTesting();

      logErrorMock = jest.fn();

      di.override(logErrorInjectable, () => logErrorMock);

      const withErrorLoggingFor = di.inject(withErrorLoggingInjectable);

      toBeDecorated = jest.fn();

      decorated = pipeline(
        toBeDecorated,
        withErrorLoggingFor((error) => `some-error-message-for-${(error as Error).message}`),
      );
    });

    describe("when function does not throw and returns value", () => {
      let returnValue: number | undefined;

      beforeEach(() => {
        toBeDecorated.mockImplementation(() => 42);

        returnValue = decorated("some-parameter", "some-other-parameter");
      });

      it("passes arguments to decorated function", () => {
        expect(toBeDecorated).toHaveBeenCalledWith("some-parameter", "some-other-parameter");
      });

      it("does not log error", () => {
        expect(logErrorMock).not.toHaveBeenCalled();
      });

      it("returns the value", () => {
        expect(returnValue).toBe(42);
      });
    });

    describe("when function does not throw and returns no value", () => {
      let returnValue: number | undefined;

      beforeEach(() => {
        toBeDecorated.mockImplementation(() => undefined);

        returnValue = decorated("some-parameter", "some-other-parameter");
      });

      it("passes arguments to decorated function", () => {
        expect(toBeDecorated).toHaveBeenCalledWith("some-parameter", "some-other-parameter");
      });

      it("does not log error", () => {
        expect(logErrorMock).not.toHaveBeenCalled();
      });

      it("returns nothing", () => {
        expect(returnValue).toBeUndefined();
      });
    });

    describe("when function throws", () => {
      let error: Error;

      beforeEach(() => {
        toBeDecorated.mockImplementation(() => {
          throw new Error("some-error");
        });

        try {
          decorated("some-parameter", "some-other-parameter");
        } catch (e) {
          error = e as Error;
        }
      });

      it("passes arguments to decorated function", () => {
        expect(toBeDecorated).toHaveBeenCalledWith("some-parameter", "some-other-parameter");
      });

      it("logs the error", () => {
        expect(logErrorMock).toHaveBeenCalledWith("some-error-message-for-some-error", error);
      });

      it("throws", () => {
        expect(error.message).toBe("some-error");
      });
    });
  });

  describe("given decorated async function", () => {
    let decorated: (a: string, b: string) => Promise<number | undefined>;
    let toBeDecorated: AsyncFnMock<typeof decorated>;
    let logErrorMock: jest.Mock;

    beforeEach(() => {
      const di = getDiForUnitTesting();

      logErrorMock = jest.fn();

      di.override(logErrorInjectable, () => logErrorMock);

      const withErrorLoggingFor = di.inject(withErrorLoggingInjectable);

      toBeDecorated = asyncFn();

      decorated = pipeline(
        toBeDecorated,

        withErrorLoggingFor(
          (error) => `some-error-message-for-${(error as Error).message || (error as { someProperty: string }).someProperty}`,
        ),
      );
    });

    describe("when called", () => {
      let returnValuePromise: Promise<number | undefined>;

      beforeEach(() => {
        returnValuePromise = decorated("some-parameter", "some-other-parameter");
      });

      it("passes arguments to decorated function", () => {
        expect(toBeDecorated).toHaveBeenCalledWith("some-parameter", "some-other-parameter");
      });

      it("does not log error yet", () => {
        expect(logErrorMock).not.toHaveBeenCalled();
      });

      it("does not resolve yet", async () => {
        const promiseStatus = await getPromiseStatus(returnValuePromise);

        expect(promiseStatus.fulfilled).toBe(false);
      });

      describe("when call rejects with error instance", () => {
        beforeEach(() => {
          void toBeDecorated.reject(new Error("some-error"));
        });

        it("logs the error", async () => {
          let error: unknown;

          try {
            await returnValuePromise;
          } catch (e) {
            error = e;
          }

          expect(logErrorMock).toHaveBeenCalledWith("some-error-message-for-some-error", error);
        });

        it("rejects", () => {
          return expect(returnValuePromise).rejects.toThrow("some-error");
        });
      });

      describe("when call rejects with something else than error instance", () => {
        let error: unknown;

        beforeEach(async () => {
          void toBeDecorated.reject({ someProperty: "some-rejection" });

          try {
            await returnValuePromise;
          } catch (e) {
            error = e;
          }
        });

        it("logs the rejection", () => {
          expect(logErrorMock).toHaveBeenCalledWith(
            "some-error-message-for-some-rejection",
            error,
          );
        });

        it("rejects", () => {
          return expect(returnValuePromise).rejects.toEqual({ someProperty: "some-rejection" });
        });
      });

      describe("when call resolves with value", () => {
        beforeEach(async () => {
          await toBeDecorated.resolve(42);
        });

        it("does not log error", () => {
          expect(logErrorMock).not.toHaveBeenCalled();
        });

        it("resolves with the value", async () => {
          const returnValue = await returnValuePromise;

          expect(returnValue).toBe(42);
        });
      });

      describe("when call resolves without value", () => {
        beforeEach(async () => {
          await toBeDecorated.resolve(undefined);
        });

        it("does not log error", () => {
          expect(logErrorMock).not.toHaveBeenCalled();
        });

        it("resolves without value", async () => {
          const returnValue = await returnValuePromise;

          expect(returnValue).toBeUndefined();
        });
      });
    });
  });
});
