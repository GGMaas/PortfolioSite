using C__.Data;
using C__.DTOs;

namespace C__.Services;

public class ProjectService : IProjectService
{

    private readonly AppDbContext _context;

    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    public List<ProjectResponseDto> GetAll()
    {
        return _context.Projects
            .Select(p => new ProjectResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                img = p.img,
                link = p.link,
                year = p.year
            })
            .ToList();
    }

    public ProjectResponseDto? GetById(int id)
    {
        return _context.Projects
            .Where(p => p.Id == id)
            .Select(p => new ProjectResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                img = p.img,
                link = p.link,
                year = p.year
            })
            .FirstOrDefault();
    }

    public ProjectResponseDto Create(CreateProjectDto dto)
    {
        var newProject = new Project
        {
            Name = dto.Name,
            Description = dto.Description,
            img = dto.img,
            link = dto.link,
            year = dto.year
        };

        _context.Projects.Add(newProject);
        _context.SaveChanges();

        return new ProjectResponseDto
        {
            Id = newProject.Id,
            Name = newProject.Name,
            Description = newProject.Description,
            img = newProject.img,
            link = newProject.link,
            year = newProject.year
        };
    }

    public bool Update(int id, CreateProjectDto dto)
    {
        var existing = _context.Projects.FirstOrDefault(p => p.Id == id);
        if (existing == null) return false;

        existing.Name = dto.Name;
        existing.Description = dto.Description;
        existing.img = dto.img;
        existing.link = dto.link;
        existing.year = dto.year;

        _context.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        var project = _context.Projects.Find(id);
        if (project == null) return false;

        _context.Projects.Remove(project);
        _context.SaveChanges();
        return true;
    }
}