/**
 * @jest-environment jsdom
 */
import { api } from "../services/api";

describe("EcoBuddy AI API client", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    window.URL.createObjectURL = jest.fn(() => "blob:mock");
    window.URL.revokeObjectURL = jest.fn();
  });

  test("getDashboard returns parsed data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { totalFootprint: 42 } })
    });

    await expect(api.getDashboard()).resolves.toEqual({ totalFootprint: 42 });
  });

  test("createActivity throws API error message", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, message: "Validation failed." })
    });

    await expect(api.createActivity({})).rejects.toThrow("Validation failed.");
  });

  test("downloadReportPdf triggers browser download", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(["pdf"])
    });

    const click = jest.fn();
    const remove = jest.fn();
    jest.spyOn(document, "createElement").mockReturnValue({
      click,
      remove
    });
    jest.spyOn(document.body, "appendChild").mockImplementation(() => {});

    await api.downloadReportPdf({ type: "weekly" });

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/reports/download/pdf?type=weekly"));
    expect(click).toHaveBeenCalled();
  });
});
