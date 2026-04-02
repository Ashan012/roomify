const PROJECT_PREFIX = "roomify_project";

const jsonError = (status, message, extra = {}) => {
  return new Response(JSON.stringify({ error: message, ...extra }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

const getUserId = async (userPuter) => {
  try {
    const user = await userPuter.auth.getUser();

    return user?.uuid || null;
  } catch (error) {
    return null;
  }
};
router.post("/api/projects/save", async ({ request, user }) => {
  try {
    console.log("Save project request received, user:", user?.username);
    const userPuter = user.puter;

    if (!userPuter) return jsonError(401, "Authentication failed");

    const body = await request.json();
    console.log("Request body parsed:", {
      projectId: body?.project?.id,
      hasSourceImage: !!body?.project?.sourceImage,
    });
    const project = body?.project;

    if (!project?.id || !project?.sourceImage) {
      return jsonError(400, "Project not found");
    }

    const payload = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    const userId = await getUserId(userPuter);
    console.log("User ID retrieved:", userId);

    if (!userId) return jsonError(401, "Authentication Failedk");
    const key = `${PROJECT_PREFIX}${project?.id}`;

    console.log("Saving project with key:", key);
    await userPuter.kv.set(key, payload);
    console.log("Project saved successfully");

    return { saved: true, id: project.id, project: payload };
  } catch (error) {
    console.error("Save project error:", error);
    return jsonError(500, "failed to save project", {
      message: error?.message || "unknown error",
      stack: error?.stack,
    });
  }
});

router.get("/api/projects/list", async ({ user }) => {
  try {
    const userPuter = user.puter;

    if (!userPuter) {
      return jsonError(401, "Auth failed");
    }
    const userId = await getUserId(userPuter);
    if (!userId) return jsonError(401, "Auth Failed");

    const projects = (await userPuter.kv.list(PROJECT_PREFIX, true)).map(
      ({ value }) => ({ ...value, isPublic: true }),
    );

    return { projects };
  } catch (error) {
    return jsonError(500, "failed to list projects", {
      message: e.message || "Unknown error",
    });
  }
});

router.get("/api/projects/get", async ({ request, user }) => {
  try {
    const userPuter = user.puter;

    if (!userPuter) {
      return jsonError(401, "Auth failed");
    }

    const userId = await getUserId(userPuter);
    if (!userId) {
      return jsonError(401, "Auth failed");
    }

    const url = new URL(request.url);

    const id = url.searchParams.get("id");
    if (!id) {
      return jsonError(400, "projectid is required");
    }

    const key = `${PROJECT_PREFIX}${id}`;

    const project = await userPuter.kv.get(key);
    if (!project) return jsonError(404, "project not found");

    return { project };
  } catch (error) {
    return jsonError(500, "failed to get project", {
      message: error?.message || "unknwon error",
    });
  }
});
