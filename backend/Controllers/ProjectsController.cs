using C__.DTOs;
using C__.Services;
using Microsoft.AspNetCore.Mvc;

namespace C__.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public ActionResult<List<ProjectResponseDto>> GetAll()
    {
        return Ok(_projectService.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<ProjectResponseDto> GetById(int id)
    {
        var project = _projectService.GetById(id);
        if (project == null) return NotFound();
        return Ok(project);
    }

    [HttpPost]
    public ActionResult<ProjectResponseDto> Create(CreateProjectDto dto)
    {
        var created = _projectService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, CreateProjectDto dto)
    {
        var success = _projectService.Update(id, dto);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var success = _projectService.Delete(id);
        if (!success) return NotFound();
        return NoContent();
    }
}