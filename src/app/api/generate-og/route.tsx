import { appURL } from "@/lib/constants";
import { fundraisers } from "@/lib/constants";
import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export async function GET(request: NextRequest) {
  const headers = new Headers({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Content-Type": "image/jpeg",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
  });
  try {
    const searchParams = request.nextUrl.searchParams;
    const fundraiserId = searchParams.get("fundraiserId");
    const raised = Number.parseFloat(searchParams.get("raised") || "0");
    const imageURL = searchParams.get("imageURL");
    const mt = searchParams.get("mt");
    const mb = searchParams.get("mb");
    const ml = searchParams.get("ml");
    const mr = searchParams.get("mr");

    const bgImageUrl = new URL("/og_background.jpeg", appURL).toString();
    const defaultImageUrl = new URL("/og_fundraider.jpeg", appURL).toString();

    if (!fundraiserId && !raised && !imageURL) {
      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              padding: "20px",
              background: "#F0DEC2",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={defaultImageUrl}
              alt="Rosalie"
              style={{
                width: "700px",
                height: "700px",
                objectFit: "contain",
                objectPosition: "top",
                boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        ),
        {
          width: 1200,
          height: 800,
          headers: headers,
        },
      );
    }
    const fundraiser = fundraisers.find((f) => f.id === fundraiserId);

    if (!fundraiser) {
      return new Response("Fundraiser not found", { status: 404 });
    }

    if (!imageURL) {
      return new Response("Image URL is required", { status: 400 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#D5C0A0",
            width: "100%",
            height: "100%",
            padding: `${mt}px ${mr}px ${mb}px ${ml}px`,
            position: "relative",
            overflow: "hidden",
            backgroundImage: `url(${bgImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#D5C0A0",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "8px",
              height: "100%",
              background: "#D5C0A0",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "90%",
              height: "90%",
              padding: "20px",
              background: "#F0DEC2",
              border: "4px solid #000",
              boxShadow:
                "12px 12px 0px 0px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.1)",
              position: "relative",
              zIndex: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                height: "100%",
              }}
            >
              <h1
                style={{
                  fontSize: "52px",
                  fontWeight: "900",
                  color: "#000",
                  textShadow: "4px 4px 0px #FFF",
                  letterSpacing: "1px",
                  lineHeight: "1.2",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                {fundraiser.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "2rem",
                  padding: "10px 20px",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "auto",
                  position: "relative",
                  marginBottom: "100px",
                }}
              >
                {/* Text Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    width: "45%",
                  }}
                >
                  <span
                    style={{
                      fontSize: "42px",
                      color: "#0D9488",
                      fontWeight: "900",
                      textShadow: "2px 2px 0px rgba(0,0,0,0.1)",
                      textAlign: "center",
                    }}
                  >
                    {raised.toFixed(4)} ETH
                  </span>
                  <span
                    style={{
                      fontSize: "28px",
                      color: "#374151",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    raised of {fundraiser.goal.toFixed(1)} ETH goal
                  </span>

                  {raised < fundraiser.goal && (
                    <div
                      style={{
                        padding: "16px",
                        background: "#FEE2E2",
                        border: "4px solid #B91C1C",
                        color: "#B91C1C",
                        fontWeight: "900",
                        fontSize: "20px",
                        textAlign: "center",
                        boxShadow: "4px 4px 0px 0px rgba(185,28,28,0.2)",
                        marginTop: "24px",
                      }}
                    >
                      Goal not reached yet — Help make a difference!
                    </div>
                  )}
                </div>

                {/* Image */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "45%",
                  }}
                >
                  <img
                    src={decodeURIComponent(imageURL)}
                    alt="Rosalie"
                    style={{
                      width: "280",
                      height: "300",
                      objectFit: "cover",
                      objectPosition: "top",
                      border: "4px solid #000",
                      boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>

              {/* Bottom Banners */}
              <div
                style={{
                  position: "absolute",
                  bottom: "60px",
                  left: "0",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  padding: "0 20px",
                }}
              >
                <div
                  style={{
                    width: "55%",
                    padding: "16px",
                    background: "#FF3366", // Light blue
                    color: "#FFF",
                    textAlign: "center",
                    fontSize: "22px",
                    fontWeight: "700",
                    border: "2px solid #FFF",
                    boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.2)",
                  }}
                >
                  Send donations to ✨ rosaliesrainbow.eth ✨
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "5px",
                  left: "0",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  padding: "0 20px",
                }}
              >
                <div
                  style={{
                    width: "65%",
                    padding: "12px",
                    background: "#000",
                    color: "#FFF",
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "700",
                    border: "2px solid #FFF",
                    boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.2)",
                  }}
                >
                  🚧 Beta - Currently Supporting only Rosalie's Campaign
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
        headers: headers,
      },
    );
  } catch (error: unknown) {
    console.error(error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "white",
            background: "red",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px",
          }}
        >
          Error generating image: {errorMessage}
        </div>
      ),
      {
        width: 1200,
        height: 800,
        headers: headers,
      },
    );
  }
}
