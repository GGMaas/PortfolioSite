using C__.DTOs;
using C__.Services;
using Microsoft.AspNetCore.Mvc;

namespace C__.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogpostsController : ControllerBase
{
    private readonly IBlogpostService _blogpostService;

    public BlogpostsController(IBlogpostService blogpostService)
    {
        _blogpostService = blogpostService;
    }

    [HttpGet]
    public ActionResult<List<BlogpostResponseDto>> GetAll()
    {
        return Ok(_blogpostService.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<BlogpostResponseDto> GetById(int id)
    {
        var blogpost = _blogpostService.GetById(id);
        if (blogpost == null) return NotFound();
        return Ok(blogpost);
    }

    [HttpPost]
    public ActionResult<BlogpostResponseDto> Create(CreateBlogpostDto dto)
    {
        var created = _blogpostService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, CreateBlogpostDto dto)
    {
        var success = _blogpostService.Update(id, dto);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var success = _blogpostService.Delete(id);
        if (!success) return NotFound();
        return NoContent();
    }
}